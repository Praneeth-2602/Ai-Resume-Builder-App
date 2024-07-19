import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

const formField = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
};

function Education() {
    const [EducationalList, setEducationalList] = useState([formField]);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(resumeInfo?.Education) && resumeInfo.Education.length > 0) {
            setEducationalList(resumeInfo.Education);
        }
    }, []);  // Adding a specific dependency to avoid unnecessary updates

    const handleChange = (event, index) => {
        const newEntries = [...EducationalList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setEducationalList(newEntries);
    };

    const AddNewEducation = () => {
        setEducationalList([...EducationalList, formField]);
    };

    const RemoveEducation = () => {
        if (EducationalList.length > 1) {
            setEducationalList(EducationalList.slice(0, -1));
        }
    };

    useEffect(() => {
        if (JSON.stringify(resumeInfo.Education) !== JSON.stringify(EducationalList)) {
            setResumeInfo({
                ...resumeInfo,
                Education: EducationalList,
            });
        }
    }, [EducationalList]);

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                Education: EducationalList.map(({ id, ...rest }) => rest),
            },
        };

        GlobalApi.UpdateResumeDetail(params.resumeId, data).then(
            (resp) => {
                setLoading(false);
                toast('Details updated!');
            },
            (error) => {
                setLoading(false);
                toast('Server Error, Please try again!');
            }
        );
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Education</h2>
            <p>Add Your Educational details</p>
            <div>
                {EducationalList.map((item, index) => (
                    <div key={index}>
                        <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                            <div className='col-span-2'>
                                <label>University Name</label>
                                <Input
                                    name="universityName"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.universityName}
                                />
                            </div>
                            <div>
                                <label>Degree</label>
                                <Input
                                    name="degree"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.degree}
                                />
                            </div>
                            <div>
                                <label>Major</label>
                                <Input
                                    name="major"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.major}
                                />
                            </div>
                            <div>
                                <label>Start Date</label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.startDate}
                                />
                            </div>
                            <div>
                                <label>End Date</label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.endDate}
                                />
                            </div>
                            <div className='col-span-2'>
                                <label>Description</label>
                                <Textarea
                                    name="description"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.description}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                    <Button variant="outline" onClick={AddNewEducation} className="text-primary"> + Add More Education</Button>
                    <Button variant="outline" onClick={RemoveEducation} className="text-primary" disabled={EducationalList.length <= 1}> - Remove</Button>
                </div>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default Education;
